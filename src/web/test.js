// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// vscode extension function that jumps to a specific line the current editor
export function jumpToLine(lineNumber) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const position = editor.selection.active;
    const newPosition = position.with(lineNumber, 0);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    editor.revealRange(newSelection);
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "keynav-utils" is now active in the web extension host!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "keynav-utils.helloWorld",
    () => {
      const a = [];
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from keynav-utils in a web extension host!"
      );
    }
  );

  context.subscriptions.push(disposable);
}
// write a function to add two numbers

// This method is called when your extension is deactivated
export function deactivate() {}
