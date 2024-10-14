import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  return {
    breeds: await fetch("https://dog.ceo/api/breeds/list/all")
      .then((res) => res.json())
      .then((data) => Object.entries(data.message) as [string, string[]][])
      .catch((err) => error(500, err.message))
    };
}

export const ssr = false;