const fs = require('fs');
const zlib = require('zlib');

const html = fs.readFileSync('index.html', 'utf8');

// Extract just the template (final HTML structure)
const templateMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (!templateMatch) {
  console.error('No template found');
  process.exit(1);
}

let template = templateMatch[1];

// Extract manifest
const manifestMatch = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const manifest = JSON.parse(manifestMatch[1]);

// Stream replace UUIDs one at a time to avoid memory issues
const outputPath = 'index-unbundled.html';
fs.writeFileSync(outputPath, ''); // Clear file

let processed = 0;
for (const [uuid, entry] of Object.entries(manifest)) {
  const binary = Buffer.from(entry.data, 'base64');
  let content = binary;

  if (entry.compressed) {
    content = zlib.gunzipSync(binary);
  }

  const text = content.toString('utf8');

  // Replace in chunks
  const chunkSize = 100000;
  let output = '';

  for (let i = 0; i < template.length; i += chunkSize) {
    const chunk = template.substring(i, Math.min(i + chunkSize, template.length));
    output += chunk.replace(new RegExp(uuid, 'g'), text);
  }

  template = output;
  processed++;
  console.log(`Processed ${processed}/${Object.keys(manifest).length}: ${uuid.substring(0, 8)}`);
}

fs.writeFileSync(outputPath, template);
console.log(`\nUnbundled to ${outputPath}`);
console.log(`Size: ${Math.round(fs.statSync(outputPath).size / 1024)}KB`);
