using System;
using Needle.Engine;

/**
 * Manually created class - this is used in the GameManager and provides info about levels
 */

[Serializable]
public class GameOption
{
    public string Name;
    public FileReference Thumbnail;
    public AssetReference Asset;
}
