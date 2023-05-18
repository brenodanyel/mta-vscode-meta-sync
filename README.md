# mta-sync-meta
This extension simplifies the process of creating meta.xml files for your MTA:SA resources. It saves you time by automatically generating the meta.xml based on the contents of your folder.

____
### HOW TO USE IT:
- Open `meta.xml`, press F1 (or Ctrl+Shift+P) and use the command `Synchronize meta.xml`.
##### OR
- Right-click `meta.xml` in vscode's file explorer and select `Synchronize meta.xml`.
___
### SCRIPT TYPES:
- Prefix your script files with `c.<FILENAME>` if you want it to be listed with `type="client"` and `cache="false"`;
- Prefix your script files with `g.<FILENAME>` if you want it to be listed with `type="shared"` and `cache="false"`;
- Scripts without these prefixes will be listed with `type="server"`.
___
### NOTE:
- It only changes `<script \>` and `<file \>`, that is, it does not change other attributes like `oop`, `min_mta_version`, etc.
___

### GIF:
![ezgif com-video-to-gif](https://github.com/brenodanyel/mta-vscode-meta-sync/assets/89032856/2c9ee213-8b6e-4cd9-ace0-2f4b0c68b8cf)
