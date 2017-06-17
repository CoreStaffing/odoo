# DNS Changes required for Odoo, Loomio and Email

* Add A record to point odoo.corestaffing.us to our odoo server
`odoo.corestaffing.us A 104.196.117.29`

* Add CNAME record to point jobs.corestaffing.us to wherever our odoo server is
`jobs.corestaffing.us CNAME odoo.corestaffing.us` 

* Add SPF record so receivers don't mark as spam @corestaffing.us addressed mail originating from google or our odoo server `corestaffing.us TXT "v=spf1 include:_spf.google.com include:odoo.corestaffing.us ~all"`

