// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const EXTENSION_NAME = "keynav-utils";
const DEFAULT_JUMP_OFFSET = 5;

const getJumpOffset = () => {
  const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
  const settingValue = config.get("jumpOffset");

  if (!settingValue) return DEFAULT_JUMP_OFFSET;

  const value = parseInt(settingValue as string, 10);

  if (!value || isNaN(value)) {
    return DEFAULT_JUMP_OFFSET;
  }

  return value;
};

function scrollToSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const position = selection.active;
  editor.revealRange(
    new vscode.Range(position, position),
    vscode.TextEditorRevealType.Default
  );
}

function findNextEmptyLine(direction: "up" | "down") {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const lineOfSelectedVar = selection.active.line;
  const document = editor.document;
  const lineCount = document.lineCount;
  let nextEmptyLine: number | undefined = undefined;

  if (direction === "up") {
    for (let i = lineOfSelectedVar - 1; i >= 0; i--) {
      const line = document.lineAt(i);
      if (line.isEmptyOrWhitespace) {
        nextEmptyLine = i;
        break;
      }
    }
  } else {
    for (let i = lineOfSelectedVar + 1; i < lineCount; i++) {
      const line = document.lineAt(i);
      if (line.isEmptyOrWhitespace) {
        nextEmptyLine = i;
        break;
      }
    }
  }

  return nextEmptyLine;
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

  const moveUpToNextEmptyLine = vscode.commands.registerCommand(
    "keynav-utils.moveUpToNextEmptyLine",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const nextEmptyLineUp = findNextEmptyLine("up") || 0;

      editor.selection = new vscode.Selection(
        new vscode.Position(nextEmptyLineUp, 0),
        new vscode.Position(nextEmptyLineUp, 0)
      );

      scrollToSelection();
    }
  );

  const moveDownToNextEmptyLine = vscode.commands.registerCommand(
    "keynav-utils.moveDownToNextEmptyLine",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const nextEmptyLineDown =
        findNextEmptyLine("down") || editor.document.lineCount;

      editor.selection = new vscode.Selection(
        new vscode.Position(nextEmptyLineDown, 0),
        new vscode.Position(nextEmptyLineDown, 0)
      );

      scrollToSelection();
    }
  );

  const selectUpToNextEmptyLine = vscode.commands.registerCommand(
    "keynav-utils.selectUpToNextEmptyLine",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const nextEmptyLineUp = findNextEmptyLine("up") || 0;

      editor.selection = new vscode.Selection(
        new vscode.Position(
          editor.selection.anchor.line,
          editor.selection.anchor.character
        ),
        new vscode.Position(nextEmptyLineUp, 0)
      );

      scrollToSelection();
    }
  );

  const selectDownToNextEmptyLine = vscode.commands.registerCommand(
    "keynav-utils.selectDownToNextEmptyLine",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const nextEmptyLineDown =
        findNextEmptyLine("down") || editor.document.lineCount;

      editor.selection = new vscode.Selection(
        new vscode.Position(
          editor.selection.anchor.line,
          editor.selection.anchor.character
        ),
        new vscode.Position(nextEmptyLineDown, 0)
      );

      scrollToSelection();
    }
  );

  const moveUpNLines = vscode.commands.registerCommand(
    "keynav-utils.moveUpNLines",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const lineOfSelectedVar = editor.selection.active.line;
      const nextLineUp = Math.max(0, lineOfSelectedVar - getJumpOffset());

      editor.selection = new vscode.Selection(
        new vscode.Position(nextLineUp, editor.selection.anchor.character),
        new vscode.Position(nextLineUp, editor.selection.anchor.character)
      );
      scrollToSelection();
    }
  );

  let moveDownNLines = vscode.commands.registerCommand(
    "keynav-utils.moveDownNLines",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const lineOfSelectedVar = editor.selection.active.line;

      const nextLineDown = Math.min(
        editor.document.lineCount,
        lineOfSelectedVar + getJumpOffset()
      );

      editor.selection = new vscode.Selection(
        new vscode.Position(nextLineDown, editor.selection.anchor.character),
        new vscode.Position(nextLineDown, editor.selection.anchor.character)
      );

      scrollToSelection();
    }
  );

  const selectUpNLines = vscode.commands.registerCommand(
    "keynav-utils.selectUpNLines",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const lineOfSelectedVar = editor.selection.active.line;
      const nextLineUp = Math.max(0, lineOfSelectedVar - getJumpOffset());

      const line = editor.document.lineAt(nextLineUp);

      editor.selection = new vscode.Selection(
        new vscode.Position(
          editor.selection.anchor.line,
          editor.selection.anchor.character
        ),
        new vscode.Position(nextLineUp, line.firstNonWhitespaceCharacterIndex)
      );

      scrollToSelection();
    }
  );

  const selectDownNLines = vscode.commands.registerCommand(
    "keynav-utils.selectDownNLines",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const lineOfSelectedVar = editor.selection.active.line;

      const nextLineDown = Math.min(
        editor.document.lineCount,
        lineOfSelectedVar + getJumpOffset()
      );

      const line = editor.document.lineAt(nextLineDown);

      editor.selection = new vscode.Selection(
        new vscode.Position(
          editor.selection.anchor.line,
          editor.selection.anchor.character
        ),
        new vscode.Position(nextLineDown, line.text.length)
      );
      scrollToSelection();
    }
  );

  context.subscriptions.push(moveUpToNextEmptyLine);
  context.subscriptions.push(moveDownToNextEmptyLine);
  context.subscriptions.push(selectUpToNextEmptyLine);
  context.subscriptions.push(selectDownToNextEmptyLine);
  context.subscriptions.push(moveUpNLines);
  context.subscriptions.push(moveDownNLines);
  context.subscriptions.push(selectUpNLines);
  context.subscriptions.push(selectDownNLines);
}

// This method is called when your extension is deactivated
export function deactivate() {}
