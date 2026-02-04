import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { usePlayerStore, useShoppingCart, useCurrentUser } from "@/lib/store";
import { useFetchTracks } from "@/lib/actions";
import { classNames, getFormatData, truncate, formatPrice } from "@/lib/utils";
import { usePlayer } from "@/hooks";

import { Icon, MetaDetailsMediaCard } from "@/components";

export default function MediaCard({ item, type }) {
  const navigate = useNavigate();

  const { playlistId, playlistType } = usePlayerStore();
  const { addItem, getItemQuantity } = useShoppingCart();
  const { currentUser } = useCurrentUser();
  const { user } = currentUser || {};

  const { fetchTracks, isSubmitting, getId } = useFetchTracks();

  const { handlePlayPause, handleGetPlaylist, isPlaying } = usePlayer();

  const isTypeTopClick = useMemo(
    () => ["category", "podcast", "artist"].includes(type),
    [type]
  );

  const isTitleCentered = useMemo(
    () => ["artist", "playlist", "category"].includes(type),
    [type]
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (type === "product" && user) {
      addItem(item);
    }
  };

  const cartQuantity = type === "product" ? getItemQuantity(item.id) : 0;

  return (
    <div
      className={classNames(
        "shadow-sm p-3 rounded bg-card hover:bg-card-hover duration-300 ease-in cursor-pointer group"
      )}
      onClick={() => {
        if (!["radio", "podcast"]?.includes(type)) {
          navigate(`/${type}/${item?.id}`);
        }
      }}
    >
      <div className="relative">
        <div
          className={classNames(
            "relative h-full w-full overflow-hidden shadow_card",
            type === "artist" ? "rounded-full" : "rounded"
          )}
        >
          {item.image ? (
            <img
              src={item.image}
              className={classNames(
                "object-cover aspect-square w-full",
                type === "artist" ? "rounded-full" : "rounded"
              )}
              width={100}
              height={100}
              alt="image"
            />
          ) : (
            <div
              className={classNames(
                "object-cover shadow-lg aspect-square h-full w-full flex_justify_center bg-card",
                type === "artist" ? "rounded-full" : " rounded"
              )}
            >
              <Icon
                name="BsMusicNoteBeamed"
                size={60}
                className="!text-secondary"
              />
            </div>
          )}
          {!isTypeTopClick && (
            <div className="play_button absolute -translate-y-[30%] -translate-x-[50%] top-[50%] left-[50%]">
              {playlistId === item.id && playlistType === type ? (
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full shadow-dialog primary_linear"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                >
                  <Icon
                    name={isPlaying ? "BsFillPauseFill" : "BsFillPlayFill"}
                    className="!text-white"
                    size={24}
                  />
                </button>
              ) : (
                <button
                  className={classNames(
                    "h-10 w-10 rounded-full shadow-play-button flex items-center justify-center primary_linear group-hover:translate-y-0  duration-300 transition-all",
                    isSubmitting && getId == item?.id
                      ? "translate-y-0"
                      : "translate-y-28"
                  )}
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (type === "product") {
                      // For products, we don't have tracks, so we can't play them
                      // Instead, navigate to product page
                      navigate(`/${type}/${item?.id}`);
                    } else {
                      const callback = (tracks) => {
                        handleGetPlaylist({
                          tracklist: getFormatData(tracks, item?.image),
                          playlistId: item?.id,
                          playlistType: item?.type,
                          savePlay: true,
                          imageAlt: item?.image,
                        });
                      };
                      fetchTracks(
                        { id: item?.id, type: item?.type, callback },
                        callback
                      );
                    }
                  }}
                >
                  <Icon
                    name={
                      isSubmitting
                        ? "HiOutlineDotsHorizontal"
                        : "AiFillEye"
                    }
                    className="!text-white"
                    size={24}
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={classNames(
          "desc mt-4",
          isTitleCentered ? "text-center" : "text-left"
        )}
      >
        <h6 className="text-sm font-semibold text-onNeutralBg">
          {truncate(item?.name, 18)}
        </h6>
        {item?.desc && (
          <p className="text-sm font-normal text-secondary">
            {truncate(item?.desc || "", type === "podcast" ? 40 : 20)}
          </p>
        )}
        {type === "product" && item?.price && (
          <div className="mt-1 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {formatPrice(item.price)}
            </p>
            {user && (
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
                onClick={handleAddToCart}
              >
                <Icon name="BsCart3" size={12} />
                {cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
              </button>
            )}
          </div>
        )}

        <MetaDetailsMediaCard
          fansNo={item?.fansNo}
          tracksNo={item?.tracksNo}
          releaseDate={item?.releaseDate}
          albumsNo={item?.albumsNo}
          type={type}      
        />
      </div>
    </div>
  );
}
