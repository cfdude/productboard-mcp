// Debug the exact body structure being built
function buildCreateNoteBody(args) {
  const body = {
    title: args.title,
    content: args.content,
  };
  
  // Add display URL
  if (args.displayUrl) {
    body.display_url = args.displayUrl;
  }

  // Add user information
  if (args.userEmail || args.userName || args.userExternalId) {
    body.user = {};
    if (args.userEmail) body.user.email = args.userEmail;
    if (args.userName) body.user.name = args.userName;
    if (args.userExternalId) body.user.external_id = args.userExternalId;
  }

  // Add company information (only if no user.email is provided)
  if (args.companyDomain && !args.userEmail) {
    body.company = { domain: args.companyDomain };
  }
  
  // Add owner information
  if (args.ownerEmail) {
    body.owner = { email: args.ownerEmail };
  }
  
  // Add source information
  if (args.sourceOrigin || args.sourceRecordId) {
    body.source = {};
    if (args.sourceOrigin) body.source.origin = args.sourceOrigin;
    if (args.sourceRecordId) body.source.record_id = args.sourceRecordId;
  }
  
  // Add optional fields
  if (args.tags && args.tags.length > 0) body.tags = args.tags;

  return body;
}

console.log('=== Testing User Email Only (No Company) ===');
const userOnlyArgs = {
  title: 'Test Note - User Only',
  content: 'Testing with user email only',
  userEmail: 'test@example.com',
  userExternalId: 'TEST_123'
};
const userOnlyBody = buildCreateNoteBody(userOnlyArgs);
console.log('Body:', JSON.stringify(userOnlyBody, null, 2));
console.log('Final request:', JSON.stringify({ data: userOnlyBody }, null, 2));

console.log('\n=== Testing Company Domain Only (No User Email) ===');
const companyOnlyArgs = {
  title: 'Test Note - Company Only',
  content: 'Testing with company domain only',
  companyDomain: 'example.com'
};
const companyOnlyBody = buildCreateNoteBody(companyOnlyArgs);
console.log('Body:', JSON.stringify(companyOnlyBody, null, 2));
console.log('Final request:', JSON.stringify({ data: companyOnlyBody }, null, 2));

console.log('\n=== Testing Full Example (User + Owner + Source) ===');
const fullArgs = {
  title: 'Test_testing notes about testing',
  content: 'Test_<b>bold</b> testing notes',
  displayUrl: 'https://developer.productboard.com',
  userEmail: 'rob.sherman@highway.ai',
  userExternalId: 'TEST_1234',
  ownerEmail: 'rob.sherman@highway.ai',
  sourceOrigin: 'productboard',
  sourceRecordId: '123',
  tags: ['Test_testing']
};
const fullBody = buildCreateNoteBody(fullArgs);
console.log('Body:', JSON.stringify(fullBody, null, 2));
console.log('Final request:', JSON.stringify({ data: fullBody }, null, 2));

console.log('\n=== Validation Check ===');
console.log('User only - has company?', userOnlyBody.company ? 'YES (ERROR)' : 'NO (CORRECT)');
console.log('Company only - has user?', companyOnlyBody.user ? 'YES (ERROR)' : 'NO (CORRECT)');
console.log('Full example - has company?', fullBody.company ? 'YES (ERROR)' : 'NO (CORRECT)');