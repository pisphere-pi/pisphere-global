// lib/pi.js - Strict Pi App Studio Step 2 Authentication Verification
// NEVER trust uid or username from the browser. Always exchange accessToken with App Studio.

const APP_STUDIO_AUTH_URL = 'https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login';

export async function verifyPiTokenWithAppStudio(accessToken) {
  if (!accessToken || typeof accessToken !== 'string') {
    return null;
  }

  try {
    const response = await fetch(APP_STUDIO_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const uid = data?.user?.uid;
    const username = data?.user?.username;

    if (!uid || !username) {
      return null;
    }

    return {
      sessionToken: String(data.sessionToken || ''),
      uid: String(uid),
      username: String(username).slice(0, 60),
      role: String(username).toUpperCase() === 'RK33' ? 'owner' : 'user',
    };
  } catch (error) {
    console.error('Pi App Studio verification error:', error);
    return null;
  }
}
