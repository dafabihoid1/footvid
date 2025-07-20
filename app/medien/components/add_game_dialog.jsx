import { insertMediaGame } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/storage/client";
import { useState } from "react";

export const AddMediaTeamDialog = ({ open, onOpenChange, availableGames }) => {
    const [selectedGame, setSelectedGame] = useState();
    const [videoFile, setVideoFile] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);

    const handleSubmit = async () => {
        let imageUrls = [];
        let videoUrl;

        imageFiles.map(async (image) => {
            const imageRes = await uploadImage(image, "media", "photos");

            if (imageRes.error) {
                console.log(error);
            }

            imageUrls.push(imageRes.imageUrl);
        });

        const videoRes = await uploadImage(videoFile, "media", "videos");

        videoUrl = videoRes.imageUrl;


        console.log(imageUrls, videoUrl)
        // const res = await insertMediaGame(selectedGame, videoFile, imageFiles);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>neues Spiel hinzufügen</DialogTitle>
                    <DialogDescription>Lade die gewünschten Medien hoch!</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {selectedGame
                                        ? `${selectedGame.home} vs ${selectedGame.away} (${formatDate(
                                              selectedGame.scheduled_date ?? selectedGame.original_date
                                          )})`
                                        : "Spiel auswählen"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuLabel>verfügbare Spiele:</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={selectedGame} onValueChange={setSelectedGame}>
                                    {availableGames?.map((game) => (
                                        <DropdownMenuRadioItem key={game.id} value={game}>
                                            {game.home} vs {game.away} (
                                            {game.scheduled_date
                                                ? formatDate(game.scheduled_date)
                                                : formatDate(game.original_date)}
                                            )
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="video-upload">Video hochladen</Label>
                        <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="image-upload">Bilder hochladen</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImageFiles(Array.from(e.target.files))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Abbrechen</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE"); // formats as DD.MM.YYYY
};

export default AddMediaTeamDialog;
