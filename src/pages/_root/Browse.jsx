import { useEffect, useState } from "react";

import { classNames } from "@/lib/utils";
import { useAppUtil } from "@/lib/store";
import { useFetchGenres } from "@/lib/actions";
import { Overlay, Icon, Button } from "@/components";

import Genre from "./Genre";

export default function Page() {
  const [getGenre, setGenre] = useState();

  const { getToggleGenres, toggleGenres } = useAppUtil();

  const { data: genres } = useFetchGenres();

  useEffect(() => {
    if (genres) setGenre(genres?.[0]?.id);
  }, [genres]);

  return (
    <div className="browse_page">
      <div className="flex flex-col gap-y-8">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-onNeutralBg mb-2">Browse by Genre</h1>
          <p className="text-secondary text-sm max-w-xl mx-auto">
            Explore different genres and discover new content.
          </p>
        </div>

        {/* Genre Filter */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="RiListIndefinite" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-onNeutralBg">Select Genre</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {genres &&
              genres?.map((genre) => (
                <Button
                  key={genre.id}
                  label={genre.name}
                  variant={getGenre === genre.id ? "contained" : "outlined"}
                  className={classNames(
                    "px-4 py-2 text-sm",
                    getGenre === genre.id && "bg-primary text-white"
                  )}
                  onClick={() => setGenre(genre.id)}
                />
              ))}
          </div>
        </div>

        {/* Genre Content */}
        <Genre id={getGenre} />
      </div>
    </div>
  );
}
