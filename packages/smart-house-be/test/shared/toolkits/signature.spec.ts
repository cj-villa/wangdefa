import { generateSignature, normalizeSignaturePayload, s } from '@/shared/toolkits/signature';

describe('shared/toolkits/signature', () => {
  it('should match known fixture from test.js compatible algorithm', () => {
    expect(generateSignature('LB50.22_CFWebUI|1772527205266')).toBe(
      'CH7RbAkH+GZuarNpKS02ItgprkkK2eQONuFdt7dwl8A='
    );
    expect(s.c('LB50.22_CFWebUI|1772527205266')).toBe(
      'CH7RbAkH+GZuarNpKS02ItgprkkK2eQONuFdt7dwl8A='
    );
  });

  it('should be deterministic and change when source changes', () => {
    const sourceA = 'LB50.22_CFWebUI|1700000000000';
    const sourceB = 'LB50.22_CFWebUI|1700000000001';

    expect(generateSignature(sourceA)).toBe(generateSignature(sourceA));
    expect(generateSignature(sourceA)).not.toBe(generateSignature(sourceB));
  });

  it('should normalize object payload with sorted keys and string conversion', () => {
    const payloadA = { b: 2, a: 1, c: true };
    const payloadB = { c: 'true', a: '1', b: '2' };
    const payloadWithEmpty = { b: 2, a: 1, c: true, d: undefined, e: null };

    expect(normalizeSignaturePayload(payloadA)).toBe('a=1&b=2&c=true');
    expect(normalizeSignaturePayload(payloadWithEmpty)).toBe('a=1&b=2&c=true');
    expect(generateSignature(payloadA)).toBe(generateSignature(payloadB));
  });
});
