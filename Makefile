test:
		@node node_modules/lab/bin/lab test.js
test-cov:
		@node node_modules/lab/bin/lab test.js -t 100
test-cov-html:
		@node node_modules/lab/bin/lab test.js -r html -o coverage.html

.PHONY: test test-cov test-cov-html
