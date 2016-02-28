var gitpull = require.safe('git-pull'),
	path = require('path'),
	npm = require('npm');

exports.match = function(text, commandPrefix) {
	return text === commandPrefix + 'update';
};

var npmUpdate = function() {
	npm.load({loglevel: "silent"}, function(err, data) {
		if (err) {
			return api.sendMessage('Updating dependencies failed. Manual intervention is probably required.', event.thread_id);
		}
		
		npm.commands.update(function(err, data) {
			if (err) {
				return api.sendMessage('Updating dependencies failed. Manual intervention is probably required.', event.thread_id);
			}
			
			api.sendMessage('Update complete. Restart to load changes.', event.thread_id);
		});
	});
};

exports.run = function(api, event) {
	var fp = path.resolve(__dirname, '../../');
	gitpull(fp, function (err, consoleOutput) {
		if (err) {
			return api.sendMessage('Update failed. Manual intervention is probably required.', event.thread_id);
		}
		api.sendMessage('Application update successful. Updating dependencies...', event.thread_id);
		npmUpdate();
	});
	return false;
};