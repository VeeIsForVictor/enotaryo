import { env } from "$env/dynamic/public"
import { assert } from "$lib/assert";

assert(typeof env.PUBLIC_ID_MODEL !== 'undefined', "missing PUBLIC_ID_MODEL");
assert(typeof env.PUBLIC_VAPID_KEY !== 'undefined', "missing PUBLIC_VAPID_KEY");
assert(typeof env.PUBLIC_QR_API !== 'undefined', "missing PUBLIC_QR_API");
assert(typeof env.PUBLIC_MOSIP_API !== 'undefined', "missing PUBLIC_MOSIP_API");

// run server-based sanity checks
export async function apiSanityCheck() {
    const qrResponse = await fetch(`${env.PUBLIC_QR_API}/`);
    assert(qrResponse.ok);
    const { serverName: qrServerName } = await qrResponse.json();
    assert(qrServerName == "enotaryo-qr-api", "qr service sanity check failed");
    const mosipResponse = await fetch(`${env.PUBLIC_MOSIP_API}/`);
    assert(mosipResponse.ok);
    const { serverName: mosipServerName } = await mosipResponse.json();
    assert(mosipServerName == "mosip-sdk-api", "mosip service sanity check failed");
}

export default {
    ID_MODEL: env.PUBLIC_ID_MODEL,
    PUBLIC_VAPID_KEY: env.PUBLIC_VAPID_KEY,
    QR_API: env.PUBLIC_QR_API,
    MOSIP_API: env.PUBLIC_MOSIP_API
}