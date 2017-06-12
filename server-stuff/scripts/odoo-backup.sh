#!/bin/bash
# Add this script to cron to make daily backups of odoo data to cloud storage
# route output to logs
exec 1> >(logger -s -t $(basename $0)) 2>&1
# NB: Need to stop server momentarily during backup otherwise data could be scrambled
echo "** STOPPING SERVER FOR BACKUP**"
/opt/bitnami/ctlscript.sh stop
# Make a name for backup
filename=/tmp/odoo$(date +%Y%m%d).tar.gz
tar -pczvf $filename /opt/bitnami
# Restart odoo services
/opt/bitnami/ctlscript.sh start
echo "** SERVER BACK ONLINE. COPYING BACKUP TO CLOUD **"
# copy backup file to cloud storage
gsutil cp $filename gs://odoo-backups
echo "** BACKUP COMPLETE. DELETING LOCAL COPY **"
# delete local copy so we don't fill up local disk
rm $filename
