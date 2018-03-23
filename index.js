#!/usr/bin/env node --harmony

/**
 * Importing Modules
 */
const program = require('commander');
const prompt = require('co-prompt');
const ProgressBar = require('progress');
const fs = require('fs');
const SVN = require('./modules/Svn');

/**
 * Program Logic
 */
program
    .version('0.0.1')
    .description('A CLI for handling WordPress SVN functions.');

program
    .description('SVN functions, like tag, push, etc.')
    .command('svn <command>')
    .option('-m, --message <message>', 'The message used when publishing an update to WordPress SVN')
    .action(function(command, options) {
        let s = new SVN(command, options);
        s.parse();
    });

program
    .command('*')
    .action(function(env){
        console.log('deploying "%s"', env);
    });

program.parse(process.argv);
