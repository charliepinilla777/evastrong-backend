const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ========== GOOGLE OAUTH ==========
passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar o crear usuario
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0]?.value,
        provider: 'google',
        emailVerified: true, // Google verifica el email
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// ========== APPLE OAUTH ==========
// Solo inicializar Apple Strategy si hay credenciales disponibles
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    let privateKeyString;
    
    // Intentar leer desde archivo local
    if (process.env.APPLE_PRIVATE_KEY_PATH && fs.existsSync(process.env.APPLE_PRIVATE_KEY_PATH)) {
      privateKeyString = fs.readFileSync(process.env.APPLE_PRIVATE_KEY_PATH, 'utf8');
    }
    // O usar variable de entorno directamente
    else if (process.env.APPLE_PRIVATE_KEY) {
      privateKeyString = process.env.APPLE_PRIVATE_KEY;
    }
    
    // Solo si tenemos la private key, configurar la estrategia
    if (privateKeyString) {
      passport.use('apple', new AppleStrategy({
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyString: privateKeyString,
        callbackURL: `${process.env.FRONTEND_URL}/auth/apple/callback`,
      }, async (accessToken, refreshToken, idToken, user, done) => {
        try {
          let existingUser = await User.findOne({ appleId: user.id });
          
          if (!existingUser) {
            existingUser = await User.create({
              appleId: user.id,
              email: user.email,
              name: user.name?.firstName || 'Usuario Apple',
              provider: 'apple',
              emailVerified: true,
            });
          }
          
          return done(null, existingUser);
        } catch (error) {
          return done(error);
        }
      }));
    } else {
      console.warn('⚠️  Apple OAuth configuración incompleta: APPLE_PRIVATE_KEY no encontrada');
    }
  } catch (error) {
    console.error('❌ Error configurando Apple OAuth:', error.message);
  }
} else {
  console.warn('⚠️  Apple OAuth deshabilitado: Variables de entorno no configuradas');
}

// ========== SERIALIZACIÓN ==========
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
