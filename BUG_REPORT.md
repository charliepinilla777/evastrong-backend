# Bug Report
**Date:** 2026-04-09
**Scope:** Daily bug scan (Thursday)

---

## 🔴 CRASH-RISK

### BACKEND

**B1. Missing Subscription model methods — all protected routes will crash at runtime**
- `middleware/checkSubscription.js:19` — calls `Subscription.findActiveByUser()` which does not exist on the model
- `middleware/checkSubscription.js:87` — calls `subscription.isActive()` and `subscription.isInGracePeriod()` which are not defined
- `middleware/checkFeatureAccess.js:27` — calls `req.subscription.canUseFeature()` which is not defined
- `middleware/checkFeatureAccess.js:287,308,309` — calls `req.subscription.getUsageLimitKey()` and `req.subscription.getCurrentUsageKey()` which are not defined
- **Suggested fix:** Add the missing statics/methods to `models/Subscription.js`:
  ```js
  subscriptionSchema.statics.findActiveByUser = async (userId) =>
    Subscription.findOne({ userId, status: 'active' });
  subscriptionSchema.methods.isActive = function () {
    return this.status === 'active' && new Date() < new Date(this.endDate);
  };
  subscriptionSchema.methods.isInGracePeriod = function () {
    const ms = new Date() - new Date(this.endDate);
    return this.status === 'expired' && ms < 3 * 24 * 60 * 60 * 1000;
  };
  subscriptionSchema.methods.canUseFeature = function (feature) {
    return this.isActive() ? { allowed: true } : { allowed: false, reason: 'subscription_expired' };
  };
  subscriptionSchema.methods.getUsageLimitKey = function (feature) {
    return { custom_routines: 'routinesLimit', custom_diets: 'dietsLimit' }[feature] ?? null;
  };
  subscriptionSchema.methods.getCurrentUsageKey = function (feature) {
    return { custom_routines: 'customRoutineCount', custom_diets: 'customDietCount' }[feature] ?? null;
  };
  ```

**B2. Socket handlers without try/catch — uncaught error crashes socket**
- `socket/chatHandler.js:63-66` — `leave_room` handler has no try/catch
- `socket/chatHandler.js:124-130` — `typing` handler has no try/catch
- `socket/chatHandler.js:133-138` — `stop_typing` handler has no try/catch
- **Suggested fix:** Wrap each handler body in `try { ... } catch (err) { socket.emit('error', { message: err.message }); }`

**B3. Chat routes without error handling — unhandled promise rejections crash server**
- `routes/chat.js:30-195` — six async route handlers (GET /conversations, GET /messages/:roomId, POST /rooms, GET /rooms/public, POST /rooms/:roomId/join, POST /chat/direct/:recipientId) have no try/catch
- **Suggested fix:** Wrap each handler in try/catch or use an `asyncHandler` wrapper

### FRONTEND

**F1. Socket null assertion — crash on connection failure**
- `lib/services/chat_service.dart:46,50,54,58,67,71,75` — `_socket!` used immediately after initialization without null check; if socket init fails silently the `!` throws
- **Suggested fix:** Guard all `_socket!` uses with `if (_socket != null)` or use `_socket?.method()`

**F2. VideoController null assertion — crash on missing video URL**
- `lib/widgets/routine_video_player.dart:44,46,67,78,117,151,152` — `_videoController!` and `_chewieController!` accessed without verifying initialization succeeded
- **Suggested fix:** Check `if (_initialized && _videoController != null)` before accessing controller properties

**F3. Null assertions on nullable form fields — crash on incomplete form**
- `lib/screens/profile_setup_screen.dart:140-145` — `_ageRange!`, `_constitution!`, `_fitnessLevel!`, `_pathologies!` used without prior null check
- **Suggested fix:** Guard with `if (_ageRange == null || ...) { show snackbar; return; }` before the assertions

**F4. Analytics duration null assertion — crash on premature session end**
- `lib/services/analytics_service.dart:120,127,202` — `currentSession.endTime!` and `currentSession.duration!` used without null checks
- **Suggested fix:** Assign `endTime` and compute `duration` locally before assigning to session; never rely on `!` on these fields

**F5. Achievement null assertions — crash when item incomplete**
- `lib/screens/achievements_screen.dart:443,453,888` — `item.category!`, `item.achievement!`, `a.unlockedAt!` used without null checks
- **Suggested fix:** Add null guards before each access; use `a.unlockedAt != null ? Text(...) : Text('Not unlocked')`

**F6. Diet screen null assertions — crash on missing optional fields**
- `lib/screens/diet_screen.dart:479,748,750,878,881,923,925` — `_error!`, `recipe.imageUrl!`, `recipe.description!` used without null checks
- `lib/screens/diet_plans_screen.dart:105,456,552,554,637,751,753,784,787` — same pattern with `_error!`, `plan.description!`, `recipe.imageUrl!`, `meal.note!`
- **Suggested fix:** Replace `x!` with null-aware access `x ?? ''` or conditional rendering

**F7. User profile service null assertion — crash on uninitialized singleton**
- `lib/services/user_profile_service.dart:87,118,162,174` — `_instance!` and `_currentUser!` used without verification
- **Suggested fix:** Use `_instance ??= UserProfileService._(); return _instance!;` (lazy init pattern)

**F8. Missing mounted check after async gap — setState after dispose**
- `lib/screens/routine_execution_screen.dart:158-162` — `_voice.speak()` called inside `Future.delayed` after `await _voice.init()` without `if (mounted)` check
- **Suggested fix:**
  ```dart
  _voice.init().then((_) {
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) _voice.speak(_voice.phaseStart('calentamiento'));
    });
  });
  ```

**F9. Admin dashboard null assertion — crash during loading race**
- `lib/screens/admin_dashboard_screen.dart:176,271-272` — `_dashboardData!` accessed without consistent null guard across all build paths
- **Suggested fix:** Null-coalesce with safe defaults or add early return when `_dashboardData == null`

---

## 🟡 Logic Bugs

### BACKEND

**B4. Subscription schema missing fields used by middleware**
- `models/Subscription.js` does not define `features`, `usageLimits`, `currentUsage`, or `exactEndDate`
- `middleware/checkSubscription.js:79-84,132,157` reads these fields — they return `undefined` silently, corrupting subscription info sent to client
- **Suggested fix:** Add fields to Subscription schema with appropriate defaults

**B5. PayPal capture response accessed without null guards**
- `routes/payments.js:246` — `captureData.purchase_units[0].payments.captures[0].id` not guarded with optional chaining
- **Suggested fix:** `const capture = captureData?.purchase_units?.[0]?.payments?.captures?.[0]; if (!capture?.id) throw new Error('Invalid PayPal response');`

**B6. Mercado Pago webhook — no signature verification + unsafe body access**
- `routes/payments.js:513-556` — webhook has zero signature/HMAC verification; any attacker can fake a payment approval
- `routes/payments.js:519` — `data.id` accessed without checking if `data` exists
- **Suggested fix:** Add HMAC-SHA256 verification using `x-signature` header and `MERCADO_PAGO_WEBHOOK_SECRET` env var; validate `req.body.type` and `req.body.data` before use

**B7. Cron job does not retry on WhatsApp failure**
- `utils/subscriptionReminder.js:59` — `sendWhatsApp()` result not checked; marks reminder as sent even if delivery failed; if function throws, entire cron crashes
- **Suggested fix:** Wrap in try/catch, only set `reminderSent5d = true` when `result.success === true`

**F10. FutureBuilder without error state — silent failures**
- `lib/widgets/protected_screen.dart:24-53` — `snapshot.hasError` not handled; on exception widget loads indefinitely
- `lib/services/subscription_guard.dart:40-55,63-77` — same issue in `protectFeature()` and `protectRoute()`
- **Suggested fix:** Add `if (snapshot.hasError) { return fallbackWidget; }` branch before the data check

**F11. Unsafe map access in DietScreen data loading**
- `lib/screens/diet_screen.dart:95-97` — direct `result['recipes'] as List<RecipeModel>` cast without null check; throws if key missing
- **Suggested fix:** `(result['recipes'] as List<dynamic>?)?.cast<RecipeModel>() ?? []`

---

## 🟢 Warnings

### BACKEND

**B8. PayPal webhook signature verification is optional**
- `routes/payments.js:297-305` — signature check skipped when `PAYPAL_WEBHOOK_ID` env var not set; dangerous in production
- **Suggested fix:** Enforce check in production: `if (process.env.NODE_ENV === 'production' && !process.env.PAYPAL_WEBHOOK_ID) throw new Error('PAYPAL_WEBHOOK_ID required');`

**B9. Wompi webhook signature verification is optional**
- `routes/payments.js:765-767` — verification skipped when `WOMPI_EVENTS_SECRET` not configured
- **Suggested fix:** Same pattern — require the secret in production

**B10. Inconsistent error response format in admin routes**
- `routes/admin.js:14-151` — some catch blocks return `{ success: false, error: '...' }`, others don't include `success`
- **Suggested fix:** Standardize all catch blocks to `res.status(500).json({ success: false, error: '...', message: dev ? err.message : undefined })`

### FRONTEND

**F12. Hardcoded Spanish strings (i18n gaps)**
- `lib/screens/routine_execution_screen.dart:781` — `'No hay ejercicios disponibles'`
- `lib/widgets/routine_video_player.dart:120,205,232,299` — 4 hardcoded strings (subtitles, no-video messages)
- `lib/screens/connection_test_screen.dart:73,109` — `'Test de Conexión Backend'`, `'Probar Conexión'`
- `lib/widgets/protected_screen.dart:201,223,287,310` — subscription gate copy hardcoded in Spanish
- `lib/services/subscription_guard.dart:136,146,163,173,211,250` — upgrade prompt copy hardcoded
- **Suggested fix:** Extract all to `AppStrings` and reference via `AppStrings.of(context).key`

---

## Summary

| Severity | Backend | Frontend | Total |
|----------|---------|----------|-------|
| 🔴 CRASH-RISK | 3 | 9 | **12** |
| 🟡 Logic Bugs | 4 | 3 | **7** |
| 🟢 Warnings | 3 | 1 (i18n: 5 files) | **4** |

**Top priorities:**
1. Add missing Subscription model methods (B1) — affects every authenticated, subscription-gated route
2. Add Mercado Pago webhook signature verification (B6) — payment fraud vector
3. Fix null assertions across Flutter screens (F1–F9) — multiple crash paths in normal usage
4. Add try/catch to socket handlers (B2) and chat routes (B3)

_Auto-generated by Bug Hunter — EvaStrong daily scan_
