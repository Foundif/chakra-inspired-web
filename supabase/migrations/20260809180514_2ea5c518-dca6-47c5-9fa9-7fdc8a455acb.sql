UPDATE public.platform_settings
SET maintenance_enabled = true,
    launch_at = '2026-08-12T04:30:00Z',
    maintenance_title = 'We are launching soon',
    maintenance_message = 'Chakra Fibre Networks is putting the finishing touches on our new website. We go live on Wednesday — for new connections or support, call or WhatsApp us anytime.'
WHERE id = 1;