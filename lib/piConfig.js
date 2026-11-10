export const PI_SDK_CONFIG = {
  version: "2.0",
  sandbox: true, 
  apiKey: process.env.NEXT_PUBLIC_PI_API_KEY || "YOUR_API_KEY_HERE" 
};

export const ADMIN_USERNAME = "@RK33"; 

export const initPiNetwork = () => {
  if (typeof window !== "undefined" && window.Pi) {
    window.Pi.init(PI_SDK_CONFIG);
  }
};

export const authenticatePiUser = async () => {
  try {
    if (typeof window !== "undefined" && window.Pi) {
      const authResult = await window.Pi.authenticate(['username', 'payments'], (incompletePayment) => {
        console.log("Incomplete payment:", incompletePayment);
      });
      const username = authResult.user.username;
      const isAdmin = `@${username}` === ADMIN_USERNAME || username === ADMIN_USERNAME;
      return { isAuthenticated: true, user: authResult.user, isAdmin, accessToken: authResult.accessToken };
    }
  } catch (error) {
    return { isAuthenticated: false, error: error.message };
  }
};
