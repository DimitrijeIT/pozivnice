#!/usr/bin/env node

/**
 * Cleanup Expired Previews Script
 *
 * Scans the preview directory and removes expired preview folders.
 *
 * Usage:
 *   node scripts/cleanup-expired.js [--dry-run]
 *
 * Options:
 *   --dry-run    Show what would be deleted without actually deleting
 */

const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const PREVIEW_DIR = path.join(ROOT_DIR, config.PATHS.preview);

/**
 * Check if a preview has expired
 */
function isExpired(metadataPath) {
  try {
    const metadata = fs.readJsonSync(metadataPath);

    if (!metadata.expires_at) {
      // No expiry date - check created_at + default expiry hours
      if (metadata.created_at) {
        const createdAt = new Date(metadata.created_at);
        const expiryTime = createdAt.getTime() + (config.PREVIEW_EXPIRY_HOURS * 60 * 60 * 1000);
        return Date.now() > expiryTime;
      }
      // No dates at all - consider expired
      return true;
    }

    const expiryDate = new Date(metadata.expires_at);
    return Date.now() > expiryDate.getTime();
  } catch (e) {
    // If we can't read metadata, consider it expired
    return true;
  }
}

/**
 * Get preview info for display
 */
function getPreviewInfo(previewDir) {
  const metadataPath = path.join(previewDir, 'metadata.json');

  try {
    const metadata = fs.readJsonSync(metadataPath);
    return {
      slug: metadata.slug || path.basename(previewDir),
      brideName: metadata.bride_name || 'Unknown',
      groomName: metadata.groom_name || 'Unknown',
      createdAt: metadata.created_at || 'Unknown',
      expiresAt: metadata.expires_at || 'Unknown'
    };
  } catch (e) {
    return {
      slug: path.basename(previewDir),
      brideName: 'Unknown',
      groomName: 'Unknown',
      createdAt: 'Unknown',
      expiresAt: 'Unknown'
    };
  }
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (dateStr === 'Unknown') return dateStr;
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('sr-RS');
  } catch (e) {
    return dateStr;
  }
}

/**
 * Main cleanup function
 */
async function cleanupExpired(dryRun = false) {
  console.log(`\n🧹 Cleaning up expired previews...`);
  if (dryRun) {
    console.log(`   (Dry run - no files will be deleted)\n`);
  } else {
    console.log('');
  }

  // Ensure preview directory exists
  if (!fs.existsSync(PREVIEW_DIR)) {
    console.log('No preview directory found. Nothing to clean up.');
    return { deleted: 0, kept: 0 };
  }

  // Get all subdirectories in preview folder
  const entries = await fs.readdir(PREVIEW_DIR, { withFileTypes: true });
  const previewDirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(PREVIEW_DIR, entry.name));

  if (previewDirs.length === 0) {
    console.log('No previews found. Nothing to clean up.');
    return { deleted: 0, kept: 0 };
  }

  let deleted = 0;
  let kept = 0;
  const deletedItems = [];
  const keptItems = [];

  for (const previewDir of previewDirs) {
    const metadataPath = path.join(previewDir, 'metadata.json');
    const info = getPreviewInfo(previewDir);

    if (isExpired(metadataPath)) {
      if (dryRun) {
        console.log(`  🗑️  Would delete: ${info.slug}`);
        console.log(`      Names: ${info.brideName} & ${info.groomName}`);
        console.log(`      Expired: ${formatDate(info.expiresAt)}`);
        console.log('');
      } else {
        console.log(`  🗑️  Deleting: ${info.slug}`);
        await fs.remove(previewDir);
      }
      deleted++;
      deletedItems.push(info);
    } else {
      kept++;
      keptItems.push(info);
    }
  }

  // Summary
  console.log('\n--- Summary ---');
  console.log(`Expired (${dryRun ? 'would delete' : 'deleted'}): ${deleted}`);
  console.log(`Active (kept): ${kept}`);

  if (keptItems.length > 0) {
    console.log('\nActive previews:');
    keptItems.forEach(item => {
      console.log(`  - ${item.slug} (expires: ${formatDate(item.expiresAt)})`);
    });
  }

  console.log('');

  return { deleted, kept, deletedItems, keptItems };
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  cleanupExpired(dryRun)
    .then(result => {
      if (result.deleted > 0 && !dryRun) {
        console.log(`✅ Cleanup complete. Removed ${result.deleted} expired preview(s).`);
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('Error during cleanup:', err);
      process.exit(1);
    });
}

module.exports = { cleanupExpired };
