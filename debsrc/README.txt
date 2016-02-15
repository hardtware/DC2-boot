To build the debian package:

    dpkg-deb --build dc2-boot_1.0-0

To Install Manually:

    sudo dpkg --install dc2-boot_1.0-0.deb

To Uninstall Manually:

    sudo dpkg --remove dc2-boot

---
Optional: Maintaining the PPA

To build the debian source package:

    debuild -S -sa -k438FA5EE

To upload to the DC2 PPA:

    dput ppa:dick-x/dc2 dc2-boot_1.0-0_source.changes
