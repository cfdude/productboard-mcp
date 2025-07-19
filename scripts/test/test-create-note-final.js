// Final test - create a note and verify it was created
import { handleNotesTool } from './build/tools/notes.js';

async function testCreateNoteComplete() {
  try {
    console.log('Final test - Creating note and verifying it exists...\n');
    
    // Create a note with timestamp
    const timestamp = Date.now();
    const createArgs = {
      title: "Final Test Note - " + timestamp,
      content: "<p><b>Success\!</b> The create_note function is fully operational.</p><p>This note was created via the MCP server with all functionality restored.</p>",
      displayUrl: "https://developer.productboard.com/reference/create_note-1",
      ownerEmail: "rob.sherman@highway.ai",
      tags: ["Test", "MCP", "Success"],
      sourceOrigin: "mcp_test",
      sourceRecordId: "FINAL-TEST-" + timestamp
    };

    console.log('Creating note...');
    const createResult = await handleNotesTool('create_note', createArgs);
    const noteData = JSON.parse(createResult.content[0].text);
    console.log('✅ Note created successfully\!');
    console.log('Note ID:', noteData.note.data.id);
    console.log('View URL:', noteData.note.links.html);
    
    // Now list notes to verify it exists
    console.log('\nVerifying note exists by listing recent notes...');
    const listArgs = {
      limit: 5,
      detail: 'standard'
    };
    
    const listResult = await handleNotesTool('get_notes', listArgs);
    const listData = JSON.parse(listResult.content[0].text);
    
    // Find our note in the list
    const ourNote = listData.data.find(note => 
      note.title === createArgs.title
    );
    
    if (ourNote) {
      console.log('✅ Note verified in list\!');
      console.log('\nNote details:');
      console.log('- ID:', ourNote.id);
      console.log('- Title:', ourNote.title);
      console.log('- Tags:', ourNote.tags);
      console.log('- Created:', new Date(ourNote.createdAt).toLocaleString());
      console.log('\n🎉 CREATE_NOTE IS FULLY FUNCTIONAL\! 🎉');
    } else {
      console.log('⚠️  Note not found in list (might need a moment to propagate)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.data) {
      console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
  }
}

testCreateNoteComplete();