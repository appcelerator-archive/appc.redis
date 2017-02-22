#!groovy
@Library('pipeline-library') _

timestamps {
	node('git && (osx || linux)') {
		stage('Checkout') {
			checkout scm
		}

		stage('Configuration') {
			sh "echo \"module.exports = { connectors: { 'appc.redis': { host: '50.30.35.9', port: 3568, opts: { db: 0, username: 'arrowtest', password: 'd303d040ccaf5ecd3c64a7dbaff855d2'} }} };\" > conf/local.js"
		}

		buildConnector {
			// don't override anything yet
		}
	}
}
