import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, User, ConfirmationResult } from "firebase/auth";

// Store the confirmation result to use in the verification step
let confirmationResult: ConfirmationResult | null = null;

/**
 * Initializes the invisible reCAPTCHA verifier if it doesn't already exist.
 */
export function setupRecaptcha(): void {
    if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible",
            }
        );
    }
}

/**
 * Sends an OTP to the provided phone number.
 * @param phone The phone number in E.164 format (e.g., +91XXXXXXXXXX)
 */
export async function sendOTP(phone: string): Promise<void> {
    try {
        setupRecaptcha();

        const appVerifier = (window as any).recaptchaVerifier;

        // Note: Ensure the phone string passed here includes the country code.
        // If your UI only provides the 10 digits, use: "+91" + phone
        confirmationResult = await signInWithPhoneNumber(
            auth,
            phone,
            appVerifier
        );
    } catch (error) {
        console.error("Error during sendOTP:", error);
        throw error;
    }
}

/**
 * Verifies the OTP code entered by the user.
 * @param code The 6-digit OTP code.
 */
export async function verifyOTP(code: string): Promise<User> {
    if (!confirmationResult) {
        throw new Error("No active OTP request found. Please request a code first.");
    }

    try {
        const result = await confirmationResult.confirm(code);
        return result.user;
    } catch (error) {
        console.error("Error during verifyOTP:", error);
        throw error;
    }
}