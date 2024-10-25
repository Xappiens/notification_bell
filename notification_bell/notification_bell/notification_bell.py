import frappe

@frappe.whitelist()
def get_notification_logs(limit=20):
    # Si el usuario es Administrator, puede ver todas las notificaciones

    filters = {"for_user": frappe.session.user}

    # Obtener las notificaciones basadas en el filtro
    notification_logs = frappe.db.get_list(
        "Notification Log",
        filters=filters,  # Aplicar el filtro por usuario si no es Administrator
        fields=["*"],
        limit=limit,
        order_by="modified desc"
    )

    # Obtener los usuarios que emitieron las notificaciones
    users = [log.from_user for log in notification_logs]
    users = [*set(users)]  # Eliminar duplicados
    user_info = frappe._dict()

    # Obtener información de los usuarios
    for user in users:
        frappe.utils.add_user_info(user, user_info)

    return {"notification_logs": notification_logs, "user_info": user_info}
