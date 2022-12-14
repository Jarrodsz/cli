import inquirer from 'inquirer';

import type { Options, RawOptions } from '../types';

// default values for unspecified args
const defaultOptions: Omit<Options, 'project'> = {
    git: false,
    husky: false,
    install: true,
    template: 'javascript'
};

// --yes flag is passed
const skipOptions: Omit<Options, 'project' | 'template'> = {
    git: true,
    husky: true,
    install: true
};

export async function promptForMissingOptions(
    options: RawOptions
): Promise<Options> {
    if (options.skipPrompts) {
        options = { ...options, ...skipOptions };
    }

    const questions = [];

    if (!options.project) {
        questions.push({
            type: 'input',
            name: 'project',
            message: "Please type project's name (cannot be empty)",
            validate: (value: string) => value.length > 0
        });
    }

    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose which project template to use',
            choices: [
                { name: 'JavaScript', value: 'javascript' },
                { name: 'TypeScript', value: 'typescript' }
            ],
            default: defaultOptions.template
        });
    }

    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository?',
            default: defaultOptions.git
        });
    }

    if (!options.husky) {
        questions.push({
            type: 'confirm',
            name: 'husky',
            message: 'Initialize Husky?',
            when(answers: inquirer.Answers) {
                return options.git || answers.git;
            },
            default: defaultOptions.husky
        });
    }

    if (!options.install) {
        questions.push({
            type: 'confirm',
            name: 'install',
            message: 'Install packages?',
            when(answers: inquirer.Answers) {
                if (answers.husky) {
                    answers.install = true;

                    return false;
                }

                return true;
            },
            default: defaultOptions.install
        });
    }

    const answers = await inquirer.prompt(questions);

    return {
        git: options.git || answers.git,
        husky: options.husky || answers.husky,
        install: options.install || answers.install,
        project: options.project || answers.project,
        template: options.template || answers.template
    };
}
