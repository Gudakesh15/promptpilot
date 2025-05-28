// content.js
// Placeholder for content script logic for Prompt Pilot Chrome extension 

// CSS for the AI Generate button
const style = document.createElement('style');
style.textContent = `
.prompt-pilot-ai-btn {
  background-color: #0a66c2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  margin-left: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 600;
}
.prompt-pilot-ai-btn:hover {
  background-color: #004182;
}
.prompt-pilot-ai-btn.loading {
  opacity: 0.7;
  pointer-events: none;
}
.prompt-pilot-ai-btn.success {
  background-color: #27ae60;
}
.prompt-pilot-ai-btn.error {
  background-color: #c20a0a;
}
`;
document.head.appendChild(style);

// Helper to find LinkedIn feed posts
function getLinkedInPosts() {
  // This selector may need adjustment if LinkedIn changes their DOM
  return document.querySelectorAll('div.feed-shared-update-v2, div.feed-shared-update');
}

// Extract the main post content from a LinkedIn post element
function extractPostContent(post) {
  // Try to find the main text container (may need adjustment if LinkedIn changes DOM)
  const mainText = post.querySelector('.feed-shared-update-v2__description, .feed-shared-text, span.break-words');
  if (mainText) {
    return mainText.innerText.trim();
  }
  // Fallback: get all text content
  return post.innerText.trim();
}

// Find the comment box for a post
function findCommentBox(post) {
  // Try to find the comment box textarea/input
  // LinkedIn uses a rich text editor for comments
  let commentBox = post.querySelector('div.comments-comment-box__editor, div.comment-box__editor, div.ql-editor');
  if (!commentBox) {
    // Try to open the comment box if not present
    const commentButton = post.querySelector('button[data-control-name="comment"]');
    if (commentButton) commentButton.click();
    // Try again after opening
    commentBox = post.querySelector('div.comments-comment-box__editor, div.comment-box__editor, div.ql-editor');
  }
  return commentBox;
}

// Send post content to API
async function sendToAPI(content) {
  const endpoint = 'https://aviking15.app.n8n.cloud/webhook-test/bccb1a8d-9b2c-4a48-b093-f99a1e23e889';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ post: content })
    });
    if (!response.ok) throw new Error('API request failed');
    // Try to parse as JSON, fallback to text
    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }
    return data;
  } catch (err) {
    throw err;
  }
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

// Inject button next to each post
function injectButtons() {
  const posts = getLinkedInPosts();
  posts.forEach(post => {
    // Prevent duplicate buttons
    if (post.querySelector('.prompt-pilot-ai-btn')) return;

    // Find the action bar (where Like/Comment/Share are)
    const actionBar = post.querySelector('[role="toolbar"]') || post.querySelector('.feed-shared-social-action-bar');
    if (!actionBar) return;

    // Create the button
    const btn = document.createElement('button');
    btn.className = 'prompt-pilot-ai-btn';
    btn.textContent = 'AI Generate';
    btn.type = 'button';
    
    // Add click event to extract post content and send to API
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const content = extractPostContent(post);
      btn.classList.add('loading');
      btn.textContent = 'Generating...';
      try {
        const apiResponse = await sendToAPI(content);
        let responseText = '';
        if (typeof apiResponse === 'string') {
          responseText = apiResponse;
        } else if (apiResponse && apiResponse.output) {
          responseText = apiResponse.output;
        } else if (apiResponse && apiResponse.result) {
          responseText = apiResponse.result;
        } else if (apiResponse && apiResponse.text) {
          responseText = apiResponse.text;
        } else {
          responseText = JSON.stringify(apiResponse);
        }
        // Copy to clipboard
        await copyToClipboard(responseText);
        // Insert into comment box
        const commentBox = findCommentBox(post);
        if (commentBox) {
          // LinkedIn uses a contenteditable div for comments
          commentBox.focus();
          // Insert text (replace existing content)
          commentBox.innerText = responseText;
          // Place cursor at end
          const range = document.createRange();
          range.selectNodeContents(commentBox);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        btn.classList.add('success');
        btn.textContent = 'Copied & Inserted!';
        setTimeout(() => {
          btn.classList.remove('success');
          btn.textContent = 'AI Generate';
        }, 2000);
      } catch (err) {
        console.error('[Prompt Pilot] API error:', err);
        btn.classList.add('error');
        btn.textContent = 'Error';
        setTimeout(() => {
          btn.classList.remove('error');
          btn.textContent = 'AI Generate';
        }, 2000);
      } finally {
        btn.classList.remove('loading');
      }
    });

    // Insert the button
    actionBar.appendChild(btn);
  });
}

// Observe for new posts (infinite scroll)
const observer = new MutationObserver(() => {
  injectButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial injection
injectButtons(); 