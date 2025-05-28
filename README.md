# Prompt Pilot

A Chrome extension that adds an "AI Generate" button next to each LinkedIn post in your feed. With a single click, it extracts the post content, sends it to an AI API, and automatically copies the response to your clipboard and inserts it into the comment box—making it easy to generate thoughtful replies in seconds.

---

**Project is now scaffolded with:**
- `manifest.json`
- `.gitignore`
- `background.js`
- `content.js`

---

## Features
- Adds an "AI Generate" button next to every LinkedIn post in your feed
- Extracts the content of the specific post when clicked
- Sends the post content to a configurable API endpoint
- Copies the AI-generated response to your clipboard
- Automatically inserts the response into the comment box for that post
- Provides visual feedback (loading, success, error)
- Works with infinite scrolling and dynamically loaded posts

---

## Requirements
- Google Chrome (latest version recommended)
- A computer running macOS, Windows, or Linux

---

## Installation (Developer Mode)

1. **Clone or Download the Repository**
   - Clone this repo or download and unzip it to your local machine.

2. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in your Chrome browser.

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner.

4. **Load Unpacked Extension**
   - Click the "Load unpacked" button.
   - Select the root folder of this project (where `manifest.json` is located).

5. **Use the Extension**
   - Navigate to [linkedin.com](https://www.linkedin.com/).
   - You should see an "AI Generate" button next to each post in your feed.
   - Click the button to generate and insert an AI-powered comment.

---

## Usage
1. Browse your LinkedIn feed as usual.
2. For any post, click the "AI Generate" button that appears next to it.
3. The extension will extract the post content, send it to the AI API, and insert the generated response into the comment box.
4. You can review, edit, and post the comment as you wish.

---

## Configuration
- The API endpoint is currently set to: `https://aviking15.app.n8n.cloud/webhook-test/bccb1a8d-9b2c-4a48-b093-f99a1e23e889`
- Payload format: `{ "post": "<extracted post content>" }`
- If you wish to change the endpoint, update the relevant code in the extension's background or content script.

---

## Development Notes
- The extension uses minimal permissions (only access to linkedin.com and clipboard).
- No user data is stored or transmitted except for the API call.
- Handles dynamically loaded posts using MutationObserver.

---

## Contributing
Pull requests and suggestions are welcome! Please open an issue or submit a PR if you have ideas for improvements or new features.

---

## License
MIT 