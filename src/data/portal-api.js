/**
 * Data access for a future authenticated portal.
 * Supply an authenticated Supabase client from the app's auth boundary.
 * Never accept a client-supplied organisation ID without membership verification.
 */
export function createPortalApi(supabase) {
  if (!supabase || typeof supabase.from !== 'function') throw new TypeError('Supabase client required');
  const list = async (table, organisationId) => {
    if (!organisationId) throw new Error('Organisation required');
    const { data, error } = await supabase.from(table).select('*').eq('organisation_id', organisationId);
    if (error) throw error;
    return data;
  };
  return {
    async memberships() {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth?.user) throw authError || new Error('Not signed in');
      const { data, error } = await supabase.from('memberships').select('organisation_id,role').eq('user_id', auth.user.id);
      if (error) throw error;
      return data;
    },
    services: org => list('services', org),
    projects: org => list('projects', org),
    leads: org => list('leads', org),
    deliverables: org => list('deliverables', org),
    tasks: org => list('tasks', org),
    messages: org => list('messages', org),
    invoices: org => list('invoices', org),
    async reviewDeliverable(id, decision) {
      if (!['approved','changes_requested'].includes(decision)) throw new Error('Invalid review decision');
      const { data, error } = await supabase.rpc('review_deliverable', { p_deliverable_id: id, p_decision: decision });
      if (error) throw error;
      return data;
    },
    async sendMessage(organisationId, body) {
      const text = String(body || '').trim();
      if (!text || text.length > 10000) throw new Error('Message must contain 1–10000 characters');
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth?.user) throw authError || new Error('Not signed in');
      const { data, error } = await supabase.from('messages').insert({ organisation_id: organisationId, sender_id: auth.user.id, body: text }).select().single();
      if (error) throw error;
      return data;
    }
  };
}
