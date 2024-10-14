import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({params, parent}) => {
  const breeds: [string, string[]][] = (await parent()).breeds;
  const breed = params.breed.split('/');
  if (breeds.every(([name]) => name !== breed[0]) || 
    (breed[1] && breeds.every(([, subbreeds]) => !subbreeds.includes(breed[1])))) {
      error(404, 'Breed not found');
  }
  
  return {
    images: await fetch(`https://dog.ceo/api/breed/${params.breed}/images`)
      .then((res) => res.json())
      .then((data) => data.message as string[])
      .catch((err) => error(500, err.message))
    };
}
export const ssr = false;