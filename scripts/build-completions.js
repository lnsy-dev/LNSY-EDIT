#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Define paths relative to the project root
const COMPLETIONS_DIR = path.join(__dirname, "..", "completions");
const OUTPUT_FILE = path.join(__dirname, "..", "completions.json");

/**
 * Build completions.json from all files in the completions directory
 */
function buildCompletions() {
  console.log("Building completions.json...");

  // Check if completions directory exists
  if (!fs.existsSync(COMPLETIONS_DIR)) {
    console.error(
      `Error: Completions directory not found at ${COMPLETIONS_DIR}`,
    );
    process.exit(1);
  }

  const completions = [];

  try {
    // Read all files from the completions directory
    const files = fs.readdirSync(COMPLETIONS_DIR);

    // Process each file
    files.forEach((file) => {
      const filePath = path.join(COMPLETIONS_DIR, file);

      // Skip directories
      if (fs.statSync(filePath).isDirectory()) {
        console.log(`Skipping directory: ${file}`);
        return;
      }

      // Get filename without extension to use as name
      const name = path.parse(file).name;

      // Read file content
      const content = fs.readFileSync(filePath, "utf8");

      // Create completion object with name, content, and empty summary
      const completion = {
        name: name,
        content: content,
        summary: "",
      };

      // Add to completions array
      completions.push(completion);

      console.log(`✓ Added completion for: ${name}`);
    });

    // Sort completions alphabetically by name for consistency
    completions.sort((a, b) => a.name.localeCompare(b.name));

    // Write the completions array to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(completions, null, 2), "utf8");

    console.log(
      `\n✅ Successfully built completions.json with ${completions.length} entries`,
    );
    console.log(`   Output: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error building completions:", error.message);
    process.exit(1);
  }
}

// Run the build
buildCompletions();
