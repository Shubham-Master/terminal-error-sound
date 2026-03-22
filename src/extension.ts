import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const sounds = ['error1.mp3', 'error2.mp3'];
  const output = vscode.window.createOutputChannel('Terminal Error Sound');

  const disposable = vscode.window.onDidEndTerminalShellExecution((e) => {
    if (e.exitCode !== 0 && e.exitCode !== undefined) {
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const soundPath = path.join(context.extensionPath, 'media', randomSound);

      try {
        const player = spawn('/usr/bin/afplay', [soundPath], {
          stdio: 'ignore',
          detached: true,
        });

        player.on('error', (error) => {
          output.appendLine(`Failed to play sound: ${error.message}`);
        });

        player.unref();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        output.appendLine(`Failed to spawn audio player: ${message}`);
      }
    }
  });

  output.appendLine('Extension activated. Waiting for terminal commands with shell integration.');
  context.subscriptions.push(disposable);
  context.subscriptions.push(output);
}

export function deactivate() {}
