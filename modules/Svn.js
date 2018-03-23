const chalk = require('chalk');
const { exec } = require('child_process');
const inquirer = require('inquirer');
const log = console.log;

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
        }
    };

    this.tag = function() {
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
        log(chalk.bold.blue('Pulling the updates down from WordPress SVN'));
        exec("svn ci -m '" + message + "'", (err, stdout, stderr) => {
            if(!err) {
                log(chalk.bold.blue('New version pushed!'));
            }
        });
    };

    this.push = function(message) {
        if(!message || message === undefined) {
            message = '';
        }
        log(chalk.bold.blue('Pushing new version to Wordpress SVN'));
        // exec("svn ci -m '" + message + "'", (err, stdout, stderr) => {
        //     if(!err) {
        //         log(chalk.bold.blue('New version pushed!'));
        //     }
        // });
    };

};