import supabase from '../src/config/supabase';

async function validate() {
  try {
    // This requires a service role key; listUsers is an admin-only operation
    const res = await (supabase.auth.admin as any).listUsers({ limit: 1 });
    if (res && res.data) {
      console.log('Supabase service role key is valid — admin listUsers succeeded.');
      process.exit(0);
    }
    console.error('Unexpected response when validating Supabase key:', res);
    process.exit(2);
  } catch (err: any) {
    console.error('Supabase key validation failed:', err.message || err);
    process.exit(1);
  }
}

validate();
