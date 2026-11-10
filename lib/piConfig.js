// File: lib/piConfig.js

export const PI_SDK_CONFIG = {
  version: "2.0",
  sandbox: true, // शुरुआत में टेस्टिंग के लिए true रहेगा, लाइव होने पर false कर देंगे
  apiKey: process.env.NEXT_PUBLIC_PI_API_KEY || "YOUR_API_KEY_HERE" // जब आपका की आएगा, यहाँ अपडेट हो जाएगा
};

// यहाँ आपका ऑफिशियल एडमिन आईडी सेट है
export const ADMIN_USERNAME = "@RK33"; 

// Pi SDK को इनिशियलाइज करने का फंक्शन
export const initPiNetwork = () => {
  if (typeof window !== "undefined" && window.Pi) {
    window.Pi.init(PI_SDK_CONFIG);
    console.log("Pi SDK Initialized successfully.");
  }
};

// यूजर को ऑथेंटिकेट करने और चेक करने का फंक्शन
export const authenticatePiUser = async () => {
  try {
    if (typeof window !== "undefined" && window.Pi) {
      const authResult = await window.Pi.authenticate(
        ['username', 'payments'], // हमें यूजरनेम और पेमेंट्स की परमिशन चाहिए
        (incompletePayment) => {
          console.log("Incomplete payment found:", incompletePayment);
        }
      );
      
      const username = authResult.user.username;
      // चेक करें कि क्या यूजर एडमिन (RK33) है
      const isAdmin = `@${username}` === ADMIN_USERNAME || username === ADMIN_USERNAME;

      return {
        isAuthenticated: true,
        user: authResult.user,
        isAdmin: isAdmin, // true अगर आप लॉगिन हैं, false बाकी सबके लिए
        accessToken: authResult.accessToken
      };
    }
  } catch (error) {
    console.error("Pi Authentication Error:", error);
    return { isAuthenticated: false, error: error.message };
  }
};
