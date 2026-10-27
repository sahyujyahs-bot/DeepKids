/* Fill these in from Supabase: Project Settings -> API (see web/SETUP.md). The anon key is meant to be public. */
window.DK_CONFIG = {
  supabaseUrl: "https://wtvsnnlpksicwhcrmkkd.supabase.co",       // e.g. https://abcdefghijkl.supabase.co
  supabaseAnonKey: "sb_publishable_3dVb5jyFzU81DEE2K5m9mA_icDPzRjf",   // the "anon" / "publishable" key
  googleClientId: "888281380736-nkdqcg3bdfaau0m0gmtq92n38spkbnsc.apps.googleusercontent.com",    // Google Cloud OAuth client id: sign-in then says "DeepKids Gurukul", not the Supabase address
  functionsUrl: "",      // leave empty to use <supabaseUrl>/functions/v1/claude
  ai: "plus"             // false = Claude off; "plus" = only families with DeepKids Plus; true = everyone
};
