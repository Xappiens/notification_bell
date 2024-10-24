frappe.ui.form.on('Notification Log', {
    onload: function(frm) {
        if (!frm.doc.read) {  // Si la notificación no está marcada como leída
            console.log('Notificación no leída');
            frappe.call({
                method: 'frappe.desk.doctype.notification_log.notification_log.mark_as_read',
                args: {
                    docname: frm.doc.name
                },
                callback: function(response) {
                    if (!response.exc) {
                        // Actualizar el campo 'read' del formulario actual
                        frm.set_value('read', 1);
                        
                        // Actualizar el contador de la campanita
                        let unreadCount = parseInt($('.notifications-icon .unread-count').text()) || 0;
                        if (unreadCount > 0) {
                            $('.notifications-icon .unread-count').text(unreadCount - 1);
                            if (unreadCount - 1 === 0) {
                                $('.notifications-icon .unread-count').hide();
                            }
                        }

                        // Opcional: Actualizar la lista desplegable de notificaciones
                        frappe.ui.notifications.update_dropdown();
                    }
                }
            });
        }
    }
});
