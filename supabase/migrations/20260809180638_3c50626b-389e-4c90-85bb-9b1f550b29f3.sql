INSERT INTO public.platform_settings (id, maintenance_enabled, launch_at, maintenance_title, maintenance_message)
VALUES (1, true, '2026-08-12T04:30:00Z', 'We are launching soon',
        'Chakra Fibre Networks is putting the finishing touches on our new website. We go live on Wednesday — for new connections or support, call or WhatsApp us anytime.')
ON CONFLICT (id) DO UPDATE
SET maintenance_enabled = EXCLUDED.maintenance_enabled,
    launch_at = EXCLUDED.launch_at,
    maintenance_title = EXCLUDED.maintenance_title,
    maintenance_message = EXCLUDED.maintenance_message;