'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    vscode.languages.registerDocumentFormattingEditProvider('stack-trace', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            var fullText = document.getText()
                .replace(new RegExp(' at ', 'g'), `${os.EOL}\tat `)
                // .replace(new RegExp('in ', 'g'), '\n\t\tin ')
                .replace(new RegExp(' --->', 'g'), `${os.EOL}--->`)
                .replace(new RegExp(' --- End of', 'g'), `${os.EOL}--- End of`)
                .replace(new RegExp('stack trace --- ', 'g'), `stack trace ---${os.EOL}`)
                .replace(new RegExp('was thrown --- ', 'g'), `was thrown ---${os.EOL}`);

            var lines = fullText.split(os.EOL);

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.trim().startsWith('at')) {
                    lines[i] = line.replace(' in ', `${os.EOL}\t\tin `);
                }
            }

            fullText = lines.join(os.EOL);

            return [
                vscode.TextEdit.delete(new vscode.Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end)),
                vscode.TextEdit.insert(new vscode.Position(0, 0), fullText)
            ];
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}