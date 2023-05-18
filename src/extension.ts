import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.syncMetaXML',
    function () {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage('No active editor detected.');
        return;
      }

      const filePath = editor.document.uri.fsPath;

      const folderPath = path.dirname(filePath);

      const metaXMLFilePath = path.join(folderPath, 'meta.xml');

      const metaXMLContent = fs.readFileSync(metaXMLFilePath, 'utf8');

      const parser = new xml2js.Parser();
      parser.parseString(metaXMLContent, (err, result) => {
        if (err) {
          return vscode.window.showErrorMessage(
            `Failed to parse meta.xml: ${err.message}`,
          );
        }

        const output = { ...result };

        // clear current script nodes
        output.meta.script = [];

        // clear current file nodes
        output.meta.file = [];

        function verifyPath(filepath: string) {
          const files = fs
            .readdirSync(filepath)
            .filter((file) => file !== 'meta.xml');

          for (const file of files) {
            if (fs.statSync(path.join(filepath, file)).isDirectory()) {
              verifyPath(path.join(filepath, file));
              continue;
            }

            switch (path.extname(file)) {
              case '.lua':
                handleLuaScript(filepath, file);
                break;
              default:
                handleFile(filepath, file);
                break;
            }
          }
        }

        function handleLuaScript(filepath: string, file: string) {
          let folder = path.relative(folderPath, filepath).replace(/\\/g, '/');
          if (folder) folder = folder + '/';

          const row = {
            file: folder + file,
          } as any;

          if (file.startsWith('c.')) {
            row.type = 'client';
            row.cache = 'false';
          } else if (file.startsWith('g.')) {
            row.type = 'shared';
            row.cache = 'false';
          } else {
            row.type = 'server';
          }

          output.meta.script.push({ $: row });
        }

        function handleFile(filepath: string, file: string) {
          let folder = path.relative(folderPath, filepath).replace(/\\/g, '/');
          if (folder) folder = folder + '/';

          output.meta.file.push({
            $: {
              file: folder + file,
              cache: 'false',
            },
          });
        }

        verifyPath(folderPath);

        const builder = new xml2js.Builder({ headless: true });
        const updatedMetaXMLContent = builder.buildObject(output);

        fs.writeFileSync(metaXMLFilePath, updatedMetaXMLContent);

        vscode.window.showInformationMessage('Meta.xml updated!');
      });
    },
  );

  context.subscriptions.push(disposable);
}
