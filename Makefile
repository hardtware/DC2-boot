all: # nothing to build

install: install_src

install_src:
	cp -r src/* $(DESTDIR)/var/www/dc2-boot/code

.PHONY: install install_src
