
import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await auth0.getSession();
        // console.log("sesja: ", session);
        // console.log("TOKEN: ", session?.tokenSet?.accessToken)
        return NextResponse.json({ accessToken: session?.tokenSet?.accessToken });
    } catch (error) {
        console.error(`[Error]: Couldn't send access token:\n${error}`);
        return NextResponse.json({ error: 'Brak dostępu lub sesja wygasła' }, { status: 401 });
    }
}