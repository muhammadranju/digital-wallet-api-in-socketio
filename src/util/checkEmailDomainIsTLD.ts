export const checkEmailDomainIsTLD = (email: string): boolean => {
  // Regular expression to extract domain and check if it's a valid TLD
  const domain = email.split('@')[1];
  const tlds = ['com', 'org', 'net', 'io', 'co', 'edu', 'gov', 'us']; // Define your allowed TLDs

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1]; // Extract last part of the domain after the last dot

  // Check if the TLD is in the allowed list
  return tlds.includes(tld);
};
