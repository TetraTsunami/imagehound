import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  return {
    breeds: await fetch("https://dog.ceo/api/breeds/list/all")
      .then((res) => res.json())
      .then((data) => data.message)
      .catch((err) => error(500, err.message))
    };
}