export const isMockSignedIn = false;

export function shouldShowAuthGate() {
  return !isMockSignedIn;
}
