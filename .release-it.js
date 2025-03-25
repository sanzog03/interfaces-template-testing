const debug = process.argv.includes('--debug');

module.exports = {
  hooks: {
      'after:release': 'echo "VERSION_NUMBER=v${version}" >> "$GITHUB_OUTPUT"'
  },
  git: {
    release: debug ? false : true,
    requireBranch: ["main", "develop", "GHGC-201/custom-interfaces-library"],
    commitMessage: "chore: release v${version}",
    tagName: 'v${version}',
    tagAnnotation: 'Release v${version}',
    pushArgs: ['--follow-tags'],
    requireCleanWorkingDir: debug ? false : true,
    requireUpstream: debug ? false : true,
    changelog: 'git log --pretty=format:%s ${latestTag}...HEAD' // Output will be passed to releaseNotes context.changelog
  },
  github: {
    release: debug ? false : true,
    releaseName: "v${version}",
    autoGenerate: false,
    releaseNotes: getReleaseNotes,
  },
  npm: {
    publish: debug ? false : true
  },
  publishConfig: {
    registry: "https://registry.npmjs.org"
  },
  plugins: {
    './release-it-plugins/recommended-bump/index.mjs': {}
  }
}

// helpers

function getReleaseNotes (context) {
  const logs = context.changelog.split('\n');
  const groupedCommits = groupCommitsByCategory(logs);
  const title = `## What's changed \n`;
  const changelog = Object.entries(groupedCommits).map(([prefix, commits]) => {
    if (commits.length > 0) {
      return `### ${prefix}\n ${commits.map((c) => "* "+c).join('\n')}`;
    }
  }).join('\n');
  return title + changelog;
}

function groupCommitsByCategory (logs) {
  // return categorized logs made during a PR.
  const grouped = {};
  const prefixes = {
    feat: '🎉 Features',
    fix: '🐛 Fixes',
    docs: '🚀 Improvements',
    ci: '🚀 Improvements',
    test: '🚀 Improvements',
    refactor: '🚀 Improvements',
    chore: '🚀 Improvements',
    revert: '🐛 Fixes'
  };

  Object.values(prefixes).forEach((category) => {
    grouped[category] = [];
  });

  Object.entries(prefixes).forEach(([prefix, category]) => {
    // from all the logs, only takes in the log that was put in during a pull request
    const regex = new RegExp(
      `^(((Initial commit)|(Merge [^\r\n]+(\s)[^\r\n]+((\s)((\s)[^\r\n]+)+)*(\s)?)|^((${prefix})(\([\w\-]+\))?!?: [^\r\n]+((\s)((\s)[^\r\n]+)+)*))(\s)?)$`
    );
    const matches = logs.filter(l => l.match(regex));
    grouped[category] = [...matches, ...grouped[category]];
  });

  return grouped;
}
