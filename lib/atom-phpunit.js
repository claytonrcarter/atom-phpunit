'use babel';

import 'atom';
import child_process from 'child_process';

export default {

  exec: null,

  activate(state) {
    this.exec = child_process.exec;

    atom.commands.add('atom-workspace', {
      'atom-phpunit:run-test': () => this.runTest()
    });
  },

  deactivate() {

  },

  runTest() {
    func = this.getFunctionName()
    if (!func) {
      atom.notifications.addError('Function name not found! Make sure your cursor is inside the test you want to run.')
      return;
    }

    this.execute(func);
  },

  execute(filter) {
    args = typeof filter === 'undefined'
      ? args = ''
      : args = ` --filter=${filter}`;

    this.exec(`./vendor/bin/phpunit --filter=${func}`, {cwd: atom.project.getPaths()[0]}, (error, stdout, stderr) => {
      if (error && stderr) {
        atom.notifications.addError('Error!', {detail: `${error}. ${stderr}`});
      } else if (error) {
        atom.notifications.addError('Test Failed!', {detail: stdout, dismissable: true});
      } else {
        atom.notifications.addSuccess('Test Passed!', {detail: stdout, dismissable: true});
      }
    });
  },

  getFunctionName() {
    let editor = atom.workspace.getActiveTextEditor()
    let pos = editor.getCursorBufferPosition()
    let buffer = editor.getBuffer()

    for (var row = pos.row; row--; row > 0) {
      line = buffer.lineForRow(row)
      if (line.includes('function '))
        return line.match('function ([^\\(]+)\\(')[1]
    }

    return false
  }

};