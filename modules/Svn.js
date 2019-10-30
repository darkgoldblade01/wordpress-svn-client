const chalk = require('chalk');
const { exec } = require('child_process');
const inquirer = require('inquirer');
const log = console.log;
const helpBold = chalk.bold.white;
const help = chalk.white;
const commands = chalk.green;
const options = chalk.yellow;
function clear() {
    process.stdout.write('\x1B[2J\x1B[0f');
}

module.exports = function (command, opts) {
    this.command = command;
    this.opts = opts;

    this.parse = function() {
        switch(this.command) {
            case 'tag-version':
                this.tag();
                break;
            case 'push':
                this.push(this.opts.message);
                break;
            case 'pull':
                this.pull();
                break;
            default:
                this.help();
                break
        }
    };

    this.tag = function() {
        clear();
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the new version?',
                name: 'version'
            },
            {
                type: 'confirm',
                message: "Would you like to publish the new release?",
                name: 'confirm',
                default: false
            }
        ]).then(function(answers) {
            log(chalk.bold.blue('Creating new SVN tag: ' + answers.version));
            exec('svn cp trunk tags/' + answers.version, (err, stdout, stderr) => {
                if(!err) {
                    log(chalk.bold.blue('New tag created'));
                    if(answers.confirm) {
                        this.push('tagging version ' + answers.version);
                    }
                }
            });
        });
    };

    this.pull = function() {
        clear();
        log(chalk.bold.blue('Pulling the updates down from WordPress SVN'));
        exec("svn up", (err, stdout, stderr) => {
            if(!err) {
                log(chalk.bold.blue('Pulled latest from SVN.'));
            }
        });
    };

    this.push = function(message) {
        clear();
        if(!message || message === undefined) {
            message = '';
        }
        log(chalk.bold.blue('Pushing new version to Wordpress SVN'));
        exec("svn ci -m '" + message + "'", (err, stdout, stderr) => {
            if(!err) {
                log(chalk.bold.blue('New version pushed!'));
            }
        });
    };

    this.help = function() {
        clear();
        log(helpBold('  Usage: wordpress svn [options] <command>'));
        log();
        log(help('  Options:'));
        log(options('       -m, --message <message> ') + help('The message used when pushing an update to the WordPress SVN. Only applies to `push` command.'));
        log(options('       -h, --help              ') + help('How the heck do you use this thing?'));
        log();
        log(help('  Commands:'));
        log();
        log(commands('      pull    ') + help('Pulls the changes to the code from the WordPress SVN to your local copy.'));
        log(commands('      push    ') + help('Pushes the current changes up to the WordPress SVN. Use ') + options('-m') + help(' option to define a message.'));
        log(commands('      tag     ') + help('Tags a new version of the plugin or theme automatically. Will prompt for version.'));
    }


};
