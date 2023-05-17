const core = require('@actions/core');
const exec = require('@actions/exec');
const semver = require('semver');

async function run() {
    try {
        const type = core.getInput('type');
        core.info(`Tag type: ${type}`);
        const describe = await execGitDescribe();
        core.info(`Git describe result: ${describe}`);
        if (describe !== '') {
            const verOld = describe.substring(1).replace(/-[0-9]+-g[0-9a-f]+$/g, '');
            if ((type === 'major' || type === 'minor' || type === 'patch') && verOld.match(/^[0-9]+.[0-9]+.[0-9]+$/) === null) {
                core.setFailed(`Incorrect version ${verOld} for tag type ${type}`);
            }
            if (type === 'prerelease' && verOld.match(/^[0-9]+.[0-9]+.[0-9]+-[a-z]+\.[0-9]+$/) === null) {
                core.setFailed(`Incorrect version ${verOld} for tag type ${type}`);
            }
            const verNew = semver.inc(verOld, type);
            const tag = `v${verNew.toString()}`;
            core.info(`Tag increment: ${tag}`);
            core.setOutput('tag', tag);
        } else {
            core.setFailed('No version tag found');
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function execGitDescribe() {
    let output = '';
    const options = {
        listeners: {
            stdout: (data) => {
                output += data.toString();
            }
        },
        ignoreReturnCode: true
    };
    const args = [
        'describe',
        '--tags', '--long',
        '--match', 'v[0-9]*.[0-9]*.[0-9]*'
    ];
    await exec.exec('git', args, options);
    return output.trim();
}

run();
