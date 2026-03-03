import { SM4 } from 'gm-crypto';

const DEFAULT_AUTH_SN = 'NXF3QkdqdTczSkFYaWQ0RA==';

const decodeAuthSn = (authSn: string) => Buffer.from(authSn, 'base64').toString('utf8');

export type SignaturePayload = string | Record<string, unknown>;

export const normalizeSignaturePayload = (payload: SignaturePayload): string => {
  if (typeof payload === 'string') {
    return payload;
  }

  // Keep deterministic ordering for object payloads.
  const keys = Object.keys(payload).sort((a, b) => a.localeCompare(b));
  return keys
    .map((key) => {
      const value = payload[key];
      if (value === undefined || value === null) {
        return '';
      }
      return `${key}=${String(value)}`;
    })
    .filter(Boolean)
    .join('&');
};

export const generateSignature = (
  payload: SignaturePayload,
  authSn: string = DEFAULT_AUTH_SN
): string => {
  const source = normalizeSignaturePayload(payload);
  if (!source) {
    return '';
  }

  const secret = decodeAuthSn(authSn);
  const keyHex = Buffer.from(secret, 'utf8').toString('hex');
  return SM4.encrypt(source, keyHex, {
    mode: SM4.constants.ECB,
    inputEncoding: 'utf8',
    outputEncoding: 'base64',
  });
};

// Keep naming compatibility with test.js qT9G module usage: s["c"](payload)
export const s = {
  c: (payload: SignaturePayload, authSn?: string) => generateSignature(payload, authSn),
};
