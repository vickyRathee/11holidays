import { HTTPException } from "hono/http-exception";

const objectToUrlEncoded = (obj: any) => {
    const urlSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
        urlSearchParams.append(key, value as string);
    }
    return urlSearchParams.toString();
};

export const captchaVerify = async (env: CloudflareBindings, recaptchaToken: string) => {
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: objectToUrlEncoded({
            secret: env.RECAPTCHA_KEY,
            response: recaptchaToken,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    if (!r.ok) {
        const errorText = await r.text();
        throw new HTTPException(400, {
            message: `Recaptcha error ${r.status}: ${errorText}`,
        });
    }

    const capthcaResult = await r.json<any>();
    
    if (!capthcaResult.success) {
        throw new HTTPException(400, {
            message: `Recaptcha error: ${capthcaResult['error-codes']?.join()}`,
        });
    }

    if (capthcaResult.score < 0.6) {
        throw new HTTPException(400, {
            message: `Human verification failed.`,
        });
    }
};